import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const UserSchema = new mongoose.Schema({
    name: String,
    sex: String,
    age: Number,
    phone: { type: String, unique: true },
    email: { type: String, unique: true },
});

UserSchema.plugin(uniqueValidator);
export default mongoose.model('User',UserSchema);