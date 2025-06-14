const swaggerConfig = {
    path: "/apis",
    documentation: {
        info: {
            title: 'Lodgify Admin Documentation',
            version: '1.0.1'
        },
        tags: [
            { name: 'Auth Session', description: 'Endpoints for authentication and session status retrieval.' },
            { name: 'User', description: 'Endpoints for user-related actions.' },
            { name: 'Admin', description: 'Endpoints for admin-related actions.' },
            { name: 'Notifications', description: 'Endpoints for notifications. Requires verified authentication.' },
            { name: 'Referral', description: 'Endpoints for referral actions and management.' },
            { name: 'Task', description: 'Endpoints for task actions and management.' },
        ]
    }
}
export default swaggerConfig