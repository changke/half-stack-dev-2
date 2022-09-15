const setEnvProd = () => {
  return new Promise((resolve, reject) => {
    process.env.NODE_ENV = 'production';
    resolve();
  });
};

export default setEnvProd;
