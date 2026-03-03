export const verifyToken = (req: Request, res: Response, next: Function) => {
    const token = req.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
        return new Response('Unauthorized', { status: 401 });
    }

    // Here you would typically verify the token with your authentication service
    // For example, using JWT verification or a similar method

    // If the token is valid, call next() to proceed to the next middleware or route handler
    // If invalid, return a 401 response

    // Placeholder for token verification logic
    const isValidToken = true; // Replace with actual token validation logic

    if (isValidToken) {
        next();
    } else {
        return new Response('Unauthorized', { status: 401 });
    }
};