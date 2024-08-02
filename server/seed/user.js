import { User } from "../models/userModel.js";
import { faker } from "@faker-js/faker";

const createFakeUser = async (usersNum) => {
  try {
    const fakeUsers = [];

    for (let i = 0; i < usersNum; i++) {
      const tempUser = User.create({
        name: faker.person.fullName(),
        username: faker.internet.userName(),
        bio: faker.lorem.sentence(10),
        password: "password",
        avatar: {
          public_id: faker.system.fileName(),
          url: faker.image.avatar(),
        },
      });

      fakeUsers.push(tempUser);
    }

    await Promise.all(fakeUsers);

    console.log("Fake users created successfully");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export { createFakeUser };
