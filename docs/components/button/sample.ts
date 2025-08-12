// Example TypeScript code for button component
import '@inform-elevate/elevate-core-ui';

// Create a primary button
const createPrimaryButton = () => {
  const button = document.createElement('elvt-button');
  button.setAttribute('tone', 'primary');
  button.textContent = 'Click me';
  
  // Add event listener
  button.addEventListener('click', () => {
    console.log('Button clicked!');
  });
  
  return button;
};

// Usage example
const myButton = createPrimaryButton();
document.body.appendChild(myButton);