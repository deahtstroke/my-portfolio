---
title: "How I’m Designing a Distributed Task Processor"
description: A deep-dive into the motivation and architecture behind my Protheon project
date: '2025-11-25'
thumbnailText: Protheon 
categories: ['Go', 'RabbitMQ', 'gRPC']
published: true
colorStart: "300 100% 50%"
colorEnd: "180 100% 50%"
---

## Motivation

Protheon, is my personal attempt at distributing the processing of several big
files into different hosts to speed up their ingestion, processing and insertion
to my own database. The initial inspiration comes from my original
[pgcr batch processor](https://www.github.com/deahtstroke/pgcr-batch-processor)
written in Java using Spring Batch. If you've seen that repository before
you might ask yourself: Didn't I already solve this problem before?
Yes, yes I did and the results were very dissapointing. Processing thousands of
files took roughly a week and a half using only my MacBook Pro. So I asked
myself: Can this be faster? To which the answer is obviously **yes**, just...
not with one machine.

This time instead of processing everything in only one host,
I used whatever hosts I had at my disposal: The same Macbook Pro,
an Intel NUC miniPC, my own gaming PC, and an MSI Claw. However, distributing tasks
across several hosts comes with its own set of challenges, challenges I did
not face when I utilized a single host such as network latency, race-conditions,
fault tolerance, and load balancing.

## The Master Node

The coordinator is the core of the system: the part that actually makes
distributed work possible. It’s responsible for:

1. Defining clear `gRPC` methods for streaming file chunks to worker nodes.
2. Managing the **workspace** for the current file that's being processed
(opening/closing files, and queueing tasks in the work queue).
3. Relay telemetry data about the current state of the system (files completed,
throughput stats, etc).

An indirect but obvious requirement is that **the host with the better hardware
profile should act as the master node**. It handles most of the I/O operations
and while I/O is influenced by computer power, network latency, and storage speed,
giving this role to the beefiest machine still yields better throughput for a
small distributed setup like this.

### Why gRPC instead of HTTP?

Another major decision that I made with the Master Node was the use of [gRPC](https://grpc.io/)
instead of HTTP-based streaming. This was made because of several limitations
that are intrinsic to TCP-based protocols:

1. **Message Framing**: In TCP, and transitively HTTP, there are no clear bounds
on messages, its just a continous stream of bytes that is relayed
to the listener/client. gRPC does not have this limitation, it has clear message
bounds and schema through the use of [Protobuf](https://protobuf.dev/).
2. **Controlled Environment**: Generally speaking, gRPC is favored over HTTP
when all communication happens in a controlled environment and there's
no need to expose public-facing endpoints. This makes node-to-node
communication simpler.
3. **Binary Efficiency**: Streaming Protobuf’s binary format
is generally faster than streaming JSON
over HTTP. This shouldn't surprise anyone: Binary payloads tend to be
leaner and quicker to parse than JSON. It's also more conveninent
for me: If ever I need JSON, I can just generate it from the
Protobuf schema using Go's `protojson` package.

### What exactly is a "workspace"?

Earlier I wrote that the master node manages a "workspace". I'm simply talking
about a directory on disk. Nothing fancier than a build directory in a
build tool such as Gradle, Node, or SvelteKit. However, this workspace
instead of containing compiled files has file chunks, more specifically,
two-hundred files each containing fifty-thousand lines
due to each compressed file having static ten million lines to process. The Master
Node handles organizing and cleaning them up whenever a worker request or finish
tasks.

### What about Load Balancing?

This responsibility is offloaded to RabbitMQ entirely because of its
natural capability to act as a
[work-queue](https://www.rabbitmq.com/tutorials/tutorial-two-go).
Its acknowledgement system works similarly to TCP's ACK system giving me solid
delivery guarantees without reinventing reliability itself. The biggest downside
to using RabbitMQ however, is the it becomes another service to configure and
maintain. But the tradeoff is absolutely worth it, the reliability and
simplicity far outweighs the operational overhead. This is how the
master node achieves effective distribution of work across multiple workers.

## The Worker Node(s)

The worker nodes were designed to be lightweight in responsibility,
only doing specific tasks in an idempotent way. In this case, ingest some bytes
from a source, transform them, and subsequently save them to a SQL database, nothing
fancy. However, they still need to have to communicate with third-party services,
namely, the database, the work queue, and the `gRPC` server. Another important
consideration is being able to use PostgreSQL's [pipeline mode](https://www.postgresql.org/docs/current/libpq-pipeline-mode.html)
for better utilization of the network while performing round trips, which is
why I decided to use the [`pgx`](https://github.com/jackc/pgx)
Go database drivers due to their focused support for this feature.

