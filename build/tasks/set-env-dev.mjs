const setEnvDev = () => {
  return new Promise((resolve, reject) => {
    process.env.NODE_ENV = 'development';
    resolve();
  });
};

export default setEnvDev;
