## Authentication API ##

# Installation 

Step 1: Using bower, it is a snap to install.  Simply add this line to your bower.json file in the dependencies section:

>  "amp-access": "git@gitorious.poc.currdc.net:prototyping/amp-access.git",
 
Step 2: run this command

> bower install

Step 3: Add the links to your index.html page

>     <script src="bower_components/amp-config/amp-config.js"></script>
>     <script src="bower_components/amp-access/amp-access.js"></script>

Step 4: Include the dependencies in your controller

>     .controller('MainCtrl', function ($scope, ampAccessService) {


More information on [bower](http://bower.io/)

# Getting Started 

** Step 1: Create a user to log in with **

First login to the website with this link (if you are not using the qa1 server, update the links in this document):

1. http://cs.qa1.poc.ae1.currdc.net:8080/wg-curriculum/auth/sso/login

How to Add a User to CS Server / Impersonate

1. Goto [http://cs.qa1.poc.ae1.currdc.net:8080/wg-curriculum/auth/impersonate](http://cs.qa1.poc.ae1.currdc.net:8080/wg-curriculum/auth/impersonate)

2. Type admin into Filter box, then select admin@amplify.com, then press "Impersonate this user"

3. Goto [http://cs.qa1.poc.ae1.currdc.net:8080/wg-curriculum/admin/welsh/index](http://cs.qa1.poc.ae1.currdc.net:8080/wg-curriculum/admin/welsh/index)

4. Select "Manage Teachers" or "Manage Users" depending on which type of user you want to add.

5. Select "Create New Student"

6. Type in valid email address, First Name, Last Name, LEAVE PASSWORD BLANK. Also, check Enabled.

7. Press Create button

Now that you have been authenticated, you are ready to login using the api.

1. The following is POC code, update to suite your needs.

<code>
		
	  $scope.CheckLogin = function (shouldRedirect) {
		ampAccessService.canRestoreSession().then(function (logdata) {

		  $scope.curstatus = logdata;
		  if (logdata.authenticated && (logdata.authenticated === true)) {
			console.log("authenticated");
			console.log(logdata);

		  } else {
			if (shouldRedirect) {
				ampAccessService.redirectToLoginPage();
			}
		  }
		}, function (reason) {
		  console.log('Failed: ' + reason);
		}, function (update) {
		  console('Got notification: ' + update);
		});
	};
  
	  $scope.logout = function () {
		ampAccessService.logout().then(function() {
		  console.log("Logged Out.");
		  $scope.CheckLogin(true);

		}, function(reason) {
		  console.log('Failed to logout: ' + reason);
		}, function(update) {
		  alert('Got notification: ' + update);
		});
		console.log("logging you out...");
	  };
</code>

Then to log in, add this line in your controller:

<code>

	$scope.CheckLogin(true);

</code>

Log out with the following line:

<code>

	$scope.logout();

</code>


# More Information 

- [Authentication API](https://confluence.wgenhq.net/display/NewCurriculum/Authentication)


