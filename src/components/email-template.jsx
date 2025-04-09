import * as React from 'react';

export const EmailTemplate = ({
    email,
}) => (
    <div style={{ 
        fontFamily: 'Arial, sans-serif',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        color: '#333'
    }}>
        <h1 style={{ color: '#4338ca' }}>Welcome, {email}!</h1>
        <p>Thank you for registering with our application.</p>
        <p>You can access your account by clicking the button below:</p>
        
        <div style={{ textAlign: 'center', margin: '30px 0' }}>
            <a 
                href={`${process.env.NEXT_PUBLIC_APP_URL}/user/login`}
                style={{
                    backgroundColor: '#4338ca',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    display: 'inline-block'
                }}
            >
                Log In to Your Account
            </a>
        </div>
        
        <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        <p>Best regards,</p>
        <p>The Team</p>
    </div>
);