import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Text is required']
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    postedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
    created: {
        type: Date,
        default: Date.now()
    },
    likes: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    comments: [{
        text: String,
        postedBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        created: {
            type: Date,
            default: Date.now()
        }
    }]
})

export default mongoose.model('Post', PostSchema);