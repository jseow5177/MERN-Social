/*
    getUniqueErrorMessage will parse the unique-constraint related error object and construct an appropriate error message.
    More on handling unique-constraint related error: https://stackoverflow.com/questions/38945608/custom-error-messages-with-mongoose
    unique-constraint IS NOT A VALIDATION ERROR

*/
const getUniqueErrorMessage = err => {
    let output;
    // console.log(err);
    try {
        // extracts the field name. It returns email per the sample above
        // const fieldName = err.message.split(':')[2].split('_')[0].trim();
        const fieldName = Object.keys(err.keyValue)[0];
        // Capitalise the field name
        output = `${fieldName.charAt(0).toUpperCase()}${fieldName.slice(1)} already exists`;
    } catch (ex) { // When error occurs in extracting substring
        output = 'Unique field already exists';
    }
    return output
}

/*
    To handle validation errors and other errors that the database may throw when queries are made.

    Errors that are not thrown because of Mongoose validator violation will contain an error code. They will be caught by the if block.
    11000 and 11001 are error codes that handle the violation of the unique constraint. The error object returned are different from validation errors.

    The else block handles validation errors.

*/
const getErrorMessage = err => {
    let message = '';
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = getUniqueErrorMessage(err);
                break;
            default:
                message = 'Something horrible went wrong';
        }
    } else {
        for (let errName in err.errors) {
            if (err.errors[errName].message) {
                message = err.errors[errName].message;
            }
        }
    }
    return message
}

export default { getErrorMessage }