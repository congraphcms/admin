
export default cbOAuthSettings;

/**
 * Factory function that creates the grab-bag cbConstant service.
 * ngInject
 */
function cbOAuthSettings(cbOAuthProvider) {
	cbOAuthProvider.configure({
		clientId: 'IlZGCT42nGd8to75RvW0zsSLFTRCvq72wNdvyDkE',
		clientSecret: 'QwlncGUSEtBdaVb4tHIou0eMd39qjvL2Rh7BLsmG',
		grantPath: '/oauth/access_token',
		revokePath: '/oauth/revoke_token',
		ownerPath: '/oauth/owner',
		scopes: 'manage_users,read_users,manage_clients,read_clients,manage_roles,read_roles,manage_content_model,read_content_model,manage_content,read_content',
		sessionName: 'cbToken'
	});
}

cbOAuthSettings.$inject = ['cbOAuthProvider'];
