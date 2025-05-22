const mongoose = require('mongoose');
   const bcrypt = require('bcryptjs');

   const userSchema = new mongoose.Schema({
     name: { type: String, required: true },
     email: { type: String, required: true, unique: true },
     phone: { type: String, unique: true, sparse: true },
     password: { type: String, required: true },
     isAdmin: { type: Boolean, default: false },
     createdAt: { type: Date, default: Date.now },
   });

   // Hash password before saving the user
   userSchema.pre('save', async function (next) {
     if (this.isModified('password')) {
       this.password = await bcrypt.hash(this.password, 10);
     }
     next();
   });

   // Method to compare passwords during login
   userSchema.methods.comparePassword = async function (candidatePassword) {
     return await bcrypt.compare(candidatePassword, this.password);
   };

   module.exports = mongoose.model('User', userSchema);