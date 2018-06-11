/*

Simple blog front end demo in order to learn AngularJS - You can add new posts, add comments, and like posts.

*/

(function(){
  var app = angular.module('blogApp',["angularMoment",'ngLetterAvatar']);

  //console.log(Date.now());
  app.controller('BlogController', ['$http', '$window', '$rootScope', function( $http,$window,$rootScope){
    
     var blog = this;
    
    
    blog.posts = {};
    blog.users = {};
    blog.updatePost =function(){
    $http.get('https://mysterious-garden-51394.herokuapp.com/posts').success(function(data){
      blog.posts = data.data;
      
    });
  }
    
    blog.updateUser =function(){
     $http.get('https://mysterious-garden-51394.herokuapp.com/users').success(function(data){
      var users = data.data;
     //console.log(blog.users);
     var obj = {};
    for (i = 0; i < users.length; i++)
    {
    blog.users[users[i].id] = users[i];
    }

    });
  }



     $rootScope.$on("updateUserMethod", function(){

           blog.updateUser();
        });

    blog.updateUser();

    $rootScope.$on("updatePostMethod",function(){
      blog.updatePost();
    });
    blog.updatePost();
   // console.log(blog.users);
      
    
     
    blog.getUsername =function(userId){
      if (userId>0 && Object.keys(blog.users).length > 0 ){
        console.log(blog.users[userId]);
        console.log(userId);
      return blog.users[userId].attributes.name ;
    }
    else{
      return '';
    }
    }
   

    $window.sessionStorage.testing = "testuser";
    blog.getCurrentUser =function() {
      //console.log("getCurrentUser :" + JSON.stringify($window.sessionStorage.currentUserId));
       
      return $window.sessionStorage.currentUserId;
      //if (UserService.currentUser()!="") {
       // return $window.sessionStorage.currentUser.data.id; 
      // body...
    }
    blog.getCurrentToken =function() {
      return $window.sessionStorage.currentUserToken;
    }
    blog.tab = 'blog';


     $rootScope.$on("selectTabMethod", function(event,tab){
        console.log(tab);
           blog.selectTab(tab);

        });
    
    blog.selectTab = function(setTab){
      if ((setTab=='new' || setTab>=0) && !(blog.getCurrentUser()>0)) {
        blog.tab='login'
      }
      else{
      blog.tab = setTab;
    }
      console.log(blog.tab)

    };
    
    blog.isSelected = function(checkTab){
      return blog.tab === checkTab;
    };
    
    blog.post = {};
    blog.addPost = function(){
      blog.post.createdOn = Date.now();
      blog.post.comments = [];
      blog.post.likes = 0;
      blog.posts.unshift(this.post);
      blog.tab = 0;
      blog.post ={};
    };   
    blog.signout = function(){
      console.log("test");
      $http({
        method : 'DELETE',
        url  : 'https://mysterious-garden-51394.herokuapp.com/logout/'+blog.getCurrentToken(),
        headers: {
          'Content-Type': "application/json",
          'X-Api-Key' : blog.getCurrentToken()
        },
      })
      $window.sessionStorage.currentUserToken='';
     $window.sessionStorage.currentUserId=0;
    } 
    
  }]);

  /*app.config(function ($httpProvider) {
    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};
  });
*/
  
 app.controller('postController', function($scope, $http,$rootScope ) {

  
    $scope.message = 'New Post Page';
    $scope.post = {};
    $scope.data = {};
    
    $scope.newpost = function() {
      
      console.log($scope.post);
      $scope.data = {post : $scope.post};
      console.log($scope.data);
      $http({
        method : 'POST',
        url : 'https://mysterious-garden-51394.herokuapp.com/posts',
        headers: {
          'Content-Type': "application/json"
        },
        data : $scope.data
      })
      .then(function(response)
      {
        $scope.msg = response.data;
        $rootScope.$emit("updatePostMethod", {});
        $rootScope.$emit("selectTabMethod", "blog");
      })
      
    }

    
  });




  app.controller('loginController', function($scope, $http,$window,$rootScope) {
    $scope.message = 'Login Page';
    $scope.user = {};
      $scope.newuser = {};
    $scope.session = {};
    $scope.data = {};
    $scope.signup = function() {
      
      console.log($scope.user);
      $scope.newuser = {user : $scope.user};
      console.log($scope.newuser);
      $http({
        method : 'POST',
        url : 'https://mysterious-garden-51394.herokuapp.com/users',
        headers: {
          'Content-Type': "application/json"
        },
        data : $scope.newuser
      })
      .then(function(response)
      {
        $scope.msg = response.data;
        $rootScope.$emit("updateUserMethod", {});
        $rootScope.$emit("selectTabMethod","login");
      })
    }

    $scope.signin = function() {

     console.log($scope.session);
      $scope.data = {session : $scope.session};
      console.log($scope.data);
      $http({
        method : 'POST',
        url : 'https://mysterious-garden-51394.herokuapp.com/login',
        headers: {
          'Content-Type': "application/json"
        },
        data : $scope.data
      })
      .then(function(response)
      {

        console.log("singin" + JSON.stringify(response.data));
        $window.sessionStorage.currentUserId = response.data.data.id;
        $window.sessionStorage.currentUserToken = response.data.data.attributes.token;
        console.log("signin :" + JSON.stringify($window.sessionStorage.currentUserId));
        $rootScope.$emit("selectTabMethod", "blog");
      })
    }
  });



  
  app.controller('CommentController', function($scope,$http){
    /*this.comment = {};
    this.addComment = function(post){
      this.comment.createdOn = Date.now();
      post.comments.push(this.comment);
      this.comment ={};
    };*/
  /* this.comment={}
     this.addcomment = function(post){
      this.comment.createdOn = Date.now();
      post.attributes.comments.push(this.comment);
      this.comment ={};
    }*/




    $scope.addlike = function(post){
      post.attributes.like = post.attributes.like+1;
      $http({
        method : 'POST',
        url  : 'https://mysterious-garden-51394.herokuapp.com/like/'+post.id,
        headers: {
          'Content-Type': "application/json"
        },
      })
     
    }
    

    $scope.comment={};
    $scope.data={};
    
 
  /*   $scope.addcomment = function(post){
     //$scope.comment.createdOn = Date.now();
     console.log("addcomment");
     console.log($scope.comment);
     console.log(post.attributes.comments);
     
     $scope.comment ={};
   }*/
    
    $scope.newcomment = function(post) {
      console.log($scope.comment);
      post.attributes.comments.push($scope.comment);
      $scope.data = {comment : $scope.comment};
      console.log($scope.data);
        $http({
        method : 'POST',
        url : 'https://mysterious-garden-51394.herokuapp.com/comments',
        headers: {
          'Content-Type': "application/json",
          'X-Api-Key' : blog.getCurrentToken()
        },
        data : $scope.data
      })
      .then(function(response)
      {
        $scope.msg = response.data;

      })
      $scope.comment ={};

      //$window.location.href = 'http://localhost:8001';

    }

  });
 
})();


//1var app = angular.module('app', ['ngRoute']);




  