import bcrypt from "bcryptjs";

export async function hashPassword(next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
}

export async function checkAdminLimit(next) {
    if(this.isNew && this.isAdmin) {
        const adminCount = await this.constructor.countDocuments({ isAdmin: true });
        if(adminCount > 0){
            throw new Error("Only one admin is allowed");
        }
    }
    next();
}

export async function matchPassword(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

