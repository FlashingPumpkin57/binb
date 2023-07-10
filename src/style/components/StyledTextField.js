import {styled, TextField} from "@mui/material";

const StyledTextField = styled(TextField)({
  // Sample text color when focused (small text at top)
  '& label.Mui-focused': {
    color: 'teal',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'teal',
  },
  // Sample text color when not focused
  '& .MuiInputLabel-root': {
    // color: 'teal',
  },
  '& .MuiOutlinedInput-input': {
    // color: 'teal',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      // borderColor: 'red',
    },
    // Border color when hovered
    '&:hover fieldset': {
      // borderColor: 'teal',
    },
    // Border color when focused
    '&.Mui-focused fieldset': {
      borderColor: 'teal',
    },
  },
});

export default StyledTextField;