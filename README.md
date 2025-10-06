# Form Validator - Email & Password

A comprehensive client-side form validator built with vanilla HTML, CSS, and JavaScript. This application demonstrates modern form validation patterns with accessibility features.

## Features

### ✅ Required Features
- **Form Fields**: Email, Password, Confirm Password, Submit button
- **Email Validation**: Uses RFC-compliant regex pattern for email format validation
- **Password Validation**: Live validation with 5 rules:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one digit
  - At least one special character (!@#$%)
- **Live Validation Feedback**: Real-time visual feedback with checkmarks/crosses
- **Password Matching**: Confirm password must match the original password
- **Form Submission Prevention**: Submit button disabled until all validations pass
- **Accessible Error Messages**: Uses aria-live regions for screen reader announcements
- **Password Visibility Toggle**: Show/hide password functionality

### 🎨 Additional Features
- **Modern UI**: Beautiful gradient background with glass-morphism design
- **Responsive Design**: Works on desktop and mobile devices
- **Accessibility**: Full keyboard navigation, ARIA labels, and screen reader support
- **Visual Feedback**: Color-coded validation states (green for valid, red for invalid)
- **Smooth Animations**: CSS transitions for better user experience
- **High Contrast Support**: Respects user's accessibility preferences
- **Reduced Motion Support**: Respects user's motion preferences

## How to Use

1. **Open the Application**: Open `index.html` in your web browser
2. **Fill the Form**:
   - Enter a valid email address
   - Create a password that meets all requirements
   - Confirm your password
3. **Watch Live Validation**: See real-time feedback as you type
4. **Submit**: Click "Create Account" when all validations pass

## File Structure

```
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and responsive design
├── script.js           # JavaScript validation logic
└── README.md           # This documentation
```

## Technical Implementation

### Email Validation
- Uses RFC 5322 compliant regex pattern
- Validates format in real-time as user types
- Shows clear error messages for invalid formats

### Password Validation
- Real-time validation of 5 security rules
- Visual indicators (✅/❌) for each rule
- Progressive disclosure of requirements
- Immediate feedback on rule compliance

### Accessibility Features
- `aria-live="polite"` for non-critical updates
- `aria-live="assertive"` for error announcements
- Proper labeling with `aria-describedby`
- Keyboard navigation support
- Screen reader friendly error messages

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Graceful degradation for older browsers

## Customization

The validator can be easily customized by modifying:
- **Validation Rules**: Edit the `passwordRules` object in `script.js`
- **Styling**: Modify `styles.css` for different visual themes
- **Email Pattern**: Update the `emailRegex` in `script.js`
- **Error Messages**: Customize messages in the validation functions

## Testing

To test the validator:
1. Try invalid email formats (missing @, invalid domain)
2. Test password rules individually
3. Verify password matching functionality
4. Test keyboard navigation
5. Verify accessibility with screen readers

## License

This project is open source and available under the MIT License.
