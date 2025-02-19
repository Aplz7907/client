export class Message {
    id?: string
    created_at?: Date
    read_at?: Date
    date_at?: Date
    sender_delete?: boolean
    recipient_delete?: boolean
    sender?: string
    recipient?: string
    content?: string
}
