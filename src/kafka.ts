import { Kafka } from 'kafkajs';


const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKER || 'localhost:9092'] });
export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: 'api-group' });


export async function startKafka() {
await producer.connect();
await consumer.connect();
}


export async function stopKafka() {
await consumer.disconnect();
await producer.disconnect();
}