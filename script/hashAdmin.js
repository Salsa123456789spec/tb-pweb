import bcrypt from 'bcryptjs';

const main = async () => {
  const hashed1 = await bcrypt.hash('sayaadmin', 10);
  console.log('Hashed sayaadmin:', hashed1);

  const hashed2 = await bcrypt.hash('akuaslab', 10);
  console.log('Hashed akuaslab:', hashed2);
};

main();
