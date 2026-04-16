import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobnumber: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "manager", "partner", "customer"],
      required: true,
      default: "customer",
    },
    dob: {
      type: String,
      required: true,
      default: "N/A",
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "others", "N/A"],
      required: true,
      default: "N/A",
    },
    city: {
      type: String,
      required: true,
      default: "N/A",
    },
    address: {
      type: String,
      required: true,
      default: "N/A",
    },
    state: {
      type: String,
      required: true,
      default: "N/A",
    },
    pin: {
      type: String,
      required: true,
      default: "N/A",
    },

    photo: {
      url: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
      },
    },
    geoLocation: {
      lat: {
        type: String,
        required: true,
        default: "N/A",
      },

      lon: {
        type: String,
        required: true,
        default: "N/A",
      },
    },
    paymentDetails: {
      upi: {
        type: String,
        required: true,
        default: "N/A",
      },
      account_number: {
        type: String,
        required: true,
        default: "N/A",
      },
      ifs_Code: {
        type: String,
        required: true,
        default: "N/A",
      },
    },
    restaurantName: {
      type: String,
      required: true,
      default: "N/A",
    },
    restaurantImages: {
      type: [
        {
          url: { type: String, required: true },
          publicID: { type: String, required: true },
        },
      ],
    },
    restaurantTiming: {
      opening: {
        type: String,
        required: true,
        default : "N/A"
      },
      closing: {
        type: String,
        required: true,
        default : "N/A"

      },
    },
    cuisine: {
      type: String,
      required: true,
      default: "N/A",
    },
    deliveryFee: {
      type : Number,
      required : true,
      default : 40,
    },
    documents: {
      gst: {
        type: String,
        required: true,
        default: "N/A",
      },
      fssai: {
        type: String,
        required: true,
        default: "N/A",
      },
      rc: {
        type: String,
        required: true,
        default: "N/A",
      },
      dl: {
        type: String,
        required: true,
        default: "N/A",
      },
      uidai: {
        type: String,
        required: true,
        default: "N/A",
      },
      pan: {
        type: String,
        required: true,
        default: "N/A",
      },
    },
    isActive: {
      type: String,
      enum: ["active", "inactive", "blocked"],
      required: true,
      default: "active",
    },
  },
  { timestamps: true },
);
userSchema.virtual('myMenu', {
  ref: 'Menu',      // The model to link to
  localField: '_id',      // The ID in the User model
  foreignField: 'restaurantID' // The field in Restaurant model that points to User
});

// Ensure virtuals are included in JSON
userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

const User = mongoose.model("User", userSchema);



export default User;
