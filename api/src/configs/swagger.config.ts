const swaggerConfig = {
    path: "/apis",
    documentation: {
        info: {
            title: 'Razor Admin Documentation',
            version: '1.0.1'
        },
        tags: [
            { name: 'Auth Session', description: 'Authentication endpoints, and auth stauts retreival' },
            { name: 'User', description: 'Endpoint for user action' },
            { name: 'Admin', description: 'Endpoint for admin action' },
            { name: 'Notifications', description: 'Endpoint for notifications a verifyed auth is required' },
        ]
    }
}
export default swaggerConfig