export const emailVerifiedPage = (redirectUrl) => `
  <html>
    <head>
      <title>Email Verified</title>
      <style>
        body {
          font-family: sans-serif;
          text-align: center;
          padding-top: 100px;
          background: #f4f4f4;
        }
        .box {
          display: inline-block;
          padding: 20px 40px;
          background: white;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        h1 {
          color: #2d8f66;
        }
        a {
          display: inline-block;
          margin-top: 15px;
          color: #007bff;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="box">
        <h1>🎉 Email Verified Successfully!</h1>
        <p>You can now use your account.</p>
        <a href="${redirectUrl}">Go to Login</a>
      </div>
    </body>
  </html>
`;
