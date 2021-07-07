
export default cbOAuthSettings;

/**
 * Factory function that creates the grab-bag cbConstant service.
 * ngInject
 */
function cbOAuthSettings(cbOAuthProvider) {
	cbOAuthProvider.configure({
		clientId: SETTINGS.CG_CLIENT_ID,
		clientSecret: SETTINGS.CG_CLIENT_SECRET,
		grantPath: '/oauth/token',
		revokePath: '/oauth/revoke',
		ownerPath: '/congraph/oauth/owner',
		// scopes: 'manage_users,read_users,manage_clients,read_clients,manage_roles,read_roles,manage_content_model,read_content_model,manage_content,read_content',
		scopes: '*',
		sessionName: 'cbToken'
	});
}

cbOAuthSettings.$inject = ['cbOAuthProvider'];
