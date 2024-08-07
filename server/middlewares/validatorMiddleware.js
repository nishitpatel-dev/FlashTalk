export const validateData = (schema) => (req, res, next) => {
  try {
    const parsedData = schema.parse(req.body);

    req.body = parsedData;

    next();
  } catch (error) {
    res.status(400).json({ errMessage: error.errors[0].message });
  }
};

export const validateParams = (schema) => (req, res, next) => {
  try {
    const params = schema.parse(req.params);

    req.params = params;

    next();
  } catch (error) {
    res.status(400).json({ errMessage: error.errors[0].message });
  }
};

export const validateFormData = (chatId, attachments) => (req, res, next) => {
  try {
    const parsedData = chatId.parse(req.body);

    const parsedFiles = attachments.parse(req.files);

    req.body = parsedData;
    req.files = parsedFiles;

    next();
  } catch (error) {
    res.status(400).json({ errMessage: error.errors[0].message });
  }
};
