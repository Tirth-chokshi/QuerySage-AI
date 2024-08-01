import dbConnect from '@/lib/dbConnect';
import User from '@/lib/model'

export const saveUser = async (user) => {
    await dbConnect();

    try {
        const existingUser = await User.findOne({ email: user.email });

        if (existingUser) {
            // Update existing user
            existingUser.name = user.name;
            existingUser.image = user.image;
            await existingUser.save();
            return existingUser;
        } else {
            // Create new user
            const newUser = new User({
                name: user.name,
                email: user.email,
                image: user.image,
            });
            await newUser.save();
            return newUser;
        }
    } catch (error) {
        console.error('Error saving user:', error);
        throw new Error('Error saving user');
    }
};
