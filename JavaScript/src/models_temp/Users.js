/** 
 * Users uf system
 * @author: Erwing FC erwingforerocastro@gmail.com
 */
import { Schema, model } from 'mongoose';

const UserSchema = newSchema({
    match: {
        type: Float32Array,
        required: true
    },
    age: {
        type: String,
    },
    gener: {
        type: String,
    },
});
export default model("Users", UserSchema);