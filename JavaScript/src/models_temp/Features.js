/** 
 * Features of System
 * @author: Erwing FC erwingforerocastro@gmail.com
 */
import { Schema, model } from 'mongoose';

const FeatureSchema = new Schema({
    feature: {
        type: String,
        required: true
    },
});
export default model("Features", FeatureSchema);