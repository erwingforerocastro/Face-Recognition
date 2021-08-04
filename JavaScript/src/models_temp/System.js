/** 
 * Esquema of principal system
 * @author: Erwing FC erwingforerocastro@gmail.com
 */
import { Schema, model } from 'mongoose';

const SystemSchema = newSchema({
    min_date_know: {
        type: Date,
        required: true
    },
    ofType: {
        type: Schema.Types.ObjectId,
        ref: 'Types',
        required: true
    },
    features: [{
        type: Schema.Types.ObjectId,
        ref: 'Features'
    }],
    date: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
export default model("System", SystemSchema);