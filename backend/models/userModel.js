const mongoose = require("mongoose");

const userModel = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pic: {
      type: String,
      default:
        "https://www.google.com/imgres?imgurl=https%3A%2F%2Fw7.pngwing.com%2Fpngs%2F340%2F956%2Fpng-transparent-profile-user-icon-computer-icons-user-profile-head-ico-miscellaneous-black-desktop-wallpaper-thumbnail.png&imgrefurl=https%3A%2F%2Fwww.pngwing.com%2Fen%2Fsearch%3Fq%3Duser&tbnid=BkRJs7UbgG97gM&vet=12ahUKEwjmoYbLoOT1AhWqj2oFHb1qANcQMyg-egQIARBv..i&docid=8Qj_3LCalWAqLM&w=360&h=360&q=icon%20img&ved=2ahUKEwjmoYbLoOT1AhWqj2oFHb1qANcQMyg-egQIARBv",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userModel);

module.exports = User;
