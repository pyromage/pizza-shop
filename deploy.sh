#!/bin/bash

# Millbrook Pizza deployment script
# This script deploys the website to AWS S3 and creates/updates the CloudFormation stack

# Configuration
STACK_NAME="millbrook-pizza"
BUCKET_NAME="millbrookpizza.com" # should match DomainName in cloudformation.yml
REGION="us-east-1"  # CloudFront certificates must be in us-east-1
CERTIFICATE_ARN="" # Add your ACM certificate ARN here

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not installed. Please install it and configure your credentials.${NC}"
    exit 1
fi

# Check if CloudFormation template exists
if [ ! -f "cloudformation.yml" ]; then
    echo -e "${RED}Error: cloudformation.yml not found in the current directory.${NC}"
    exit 1
fi

# Function to deploy CloudFormation stack
deploy_cloudformation() {
    echo -e "${YELLOW}Deploying CloudFormation stack...${NC}"
    
    # Check if stack exists
    if aws cloudformation describe-stacks --stack-name $STACK_NAME --region $REGION &> /dev/null; then
        # Update existing stack
        echo -e "${YELLOW}Updating existing stack: $STACK_NAME${NC}"
        aws cloudformation update-stack \
            --stack-name $STACK_NAME \
            --template-body file://cloudformation.yml \
            --parameters ParameterKey=DomainName,ParameterValue=$BUCKET_NAME \
                         ParameterKey=AcmCertificateArn,ParameterValue=$CERTIFICATE_ARN \
            --capabilities CAPABILITY_IAM \
            --region $REGION
        
        # Wait for stack update to complete
        echo -e "${YELLOW}Waiting for stack update to complete...${NC}"
        aws cloudformation wait stack-update-complete --stack-name $STACK_NAME --region $REGION
    else
        # Create new stack
        echo -e "${YELLOW}Creating new stack: $STACK_NAME${NC}"
        aws cloudformation create-stack \
            --stack-name $STACK_NAME \
            --template-body file://cloudformation.yml \
            --parameters ParameterKey=DomainName,ParameterValue=$BUCKET_NAME \
                         ParameterKey=AcmCertificateArn,ParameterValue=$CERTIFICATE_ARN \
            --capabilities CAPABILITY_IAM \
            --region $REGION
        
        # Wait for stack creation to complete
        echo -e "${YELLOW}Waiting for stack creation to complete...${NC}"
        aws cloudformation wait stack-create-complete --stack-name $STACK_NAME --region $REGION
    fi
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}CloudFormation stack deployment completed successfully!${NC}"
    else
        echo -e "${RED}CloudFormation stack deployment failed.${NC}"
        exit 1
    fi
}

# Function to upload website files to S3
upload_to_s3() {
    echo -e "${YELLOW}Uploading website files to S3...${NC}"
    
    # Sync files to S3 bucket
    aws s3 sync . s3://$BUCKET_NAME \
        --exclude ".git/*" \
        --exclude "*.sh" \
        --exclude "cloudformation.yml" \
        --exclude "README.md" \
        --exclude "deploy.sh" \
        --exclude ".DS_Store" \
        --region $REGION
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Website files uploaded successfully!${NC}"
    else
        echo -e "${RED}Failed to upload website files.${NC}"
        exit 1
    fi
}

# Main execution
echo -e "${YELLOW}Starting deployment for Millbrook Pizza website...${NC}"

# Deploy CloudFormation stack
deploy_cloudformation

# Upload website files to S3
upload_to_s3

# Get CloudFront distribution URL
CLOUDFRONT_URL=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --region $REGION --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDomainName'].OutputValue" --output text)

echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${GREEN}Your website is available at: https://$CLOUDFRONT_URL${NC}"
echo -e "${GREEN}Once DNS is configured, it will be available at: https://$BUCKET_NAME${NC}"

exit 0