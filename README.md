# Millbrook Pizza Shop

A serverless web application for a takeout pizza shop that allows customers to view the menu, place orders, and make payments online.

## Features

- Responsive and modern landing page
- Interactive menu with categorized items
- Cart functionality for online ordering
- Checkout system with Stripe payment integration
- Contact information and business hours
- Fully serverless architecture using AWS S3 and CloudFront

## Project Structure

```
pizza-shop/
├── index.html                # Main HTML file
├── css/
│   └── styles.css           # CSS styles
├── js/
│   ├── main.js              # Main JavaScript functionality
│   ├── cart.js              # Cart functionality
│   └── payment.js           # Payment processing with Stripe
├── images/                   # Image assets
├── cloudformation.yml        # AWS CloudFormation template
├── deploy.sh                 # Deployment script
└── README.md                 # Project documentation
```

## Technologies Used

- HTML5, CSS3, and JavaScript (ES6+)
- AWS S3 for static website hosting
- AWS CloudFront for content delivery
- AWS CloudFormation for infrastructure as code
- Stripe API for payment processing

## Getting Started

### Prerequisites

- AWS CLI installed and configured
- An AWS account with appropriate permissions
- A Stripe account (for payment processing)

### Local Development

To run the site locally, simply open `index.html` in your browser.

```bash
# Open index.html in your default browser
open index.html
```

### Deployment

1. Update the configuration in `deploy.sh`:
   - Set your preferred `STACK_NAME`
   - Set the `BUCKET_NAME` to your domain (e.g., millbrookpizza.com)
   - Set the `REGION` (default is us-east-1)
   - Set your `CERTIFICATE_ARN` if you have an SSL certificate

2. Run the deployment script:
   ```bash
   ./deploy.sh
   ```

3. Configure your domain's DNS to point to the CloudFront distribution.

## Customization

### Menu Items

Menu items are defined in `js/main.js`. You can update the menu by modifying the `menuItems`, `sideItems`, and `drinkItems` arrays.

### Styling

Update the styles in `css/styles.css` to match your brand colors and design preferences.

### Images

Replace the placeholder images in the `images/` directory with your actual pizza and food images.

## Stripe Integration

This project includes a simplified Stripe integration. For production use:

1. Replace the placeholder Stripe publishable key in `js/payment.js`
2. Implement a secure serverless function to create payment intents
3. Update the form submission handler in `js/payment.js`

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Icons and illustrations from [source]
- Pizza menu inspiration from [source]