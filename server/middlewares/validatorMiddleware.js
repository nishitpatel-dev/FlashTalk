export const validateData = (schema) => (req, res, next) => {
  try {
    const parsedData = schema.parse(req.body);

    console.log(parsedData);
    
    req.body = parsedData;

    next();
  } catch (error) {
    res.status(400).json({ errMessage: error.errors[0].message });
  }
};
