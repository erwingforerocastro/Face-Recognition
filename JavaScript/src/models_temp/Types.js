/** 
 * Types of systems
 * @author: Erwing FC erwingforerocastro@gmail.com
 */
import { Schema, model } from 'mongoose';

const TypeSchema = newSchema({
    type: {
        type: String,
        required: true
    },
});
export default model("Types", TypeSchema);