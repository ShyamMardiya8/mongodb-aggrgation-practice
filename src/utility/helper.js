export const addResponse = (
  res,
  { status = 200, success = true, data = null, message = "", error = null } = {}
) => {
  return res.status(status).json({
    success,
    message,
    ...(data && { data }),
    ...(error && { error }),
  });
};

export const missingField = (field) => {
  const missingField = Object.entries(field)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  return (
    (isValid = missingField.length !== 0),
    (missingField = missingField.join(","))
  );
};
