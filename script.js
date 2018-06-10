/*

Simple blog front end demo in order to learn AngularJS - You can add new posts, add comments, and like posts.

*/

(function(){
  var app = angular.module('blogApp',[]);

  
  app.controller('BlogController', ['$http', '$window', '$rootScope', function( $http,$window,$rootScope){
    
     var blog = this;
    
    
    blog.posts = {};
    blog.users = {};

    $http.get('http://localhost:3000/posts').success(function(data){
      blog.posts = data.data;
      
    });
    
     $http.get('http://localhost:3000/users').success(function(data){
      var users = data.data;
     //console.log(blog.users);

    var obj = {};
    for (i = 0; i < users.length; i++)
    {
    blog.users[users[i].id] = users[i];
    }
   // console.log(blog.users);
      
    });
     
    blog.getUsername =function(userId){
      
      return blog.users[userId].attributes.name ;
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


     $rootScope.$on("selectTabMethod", function(){

           blog.selectTab("blog");
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
        url  : 'http://localhost:3000/logout/'+blog.getCurrentToken(),
        headers: {
          'Content-Type': "application/json"
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
  
 app.controller('postController', function($scope, $http,$window ) {

  
    $scope.message = 'New Post Page';
    $scope.post = {};
    $scope.data = {};
    
    $scope.newpost = function() {
      
      console.log($scope.post);
      $scope.data = {post : $scope.post};
      console.log($scope.data);
      $http({
        method : 'POST',
        url : 'http://localhost:3000/posts',
        headers: {
          'Content-Type': "application/json"
        },
        data : $scope.data
      })
      .then(function(response)
      {
        $scope.msg = response.data;
      })
      $window.location.href = 'http://localhost:8000';
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
        url : 'http://localhost:3000/users',
        headers: {
          'Content-Type': "application/json"
        },
        data : $scope.newuser
      })
      .then(function(response)
      {
        $scope.msg = response.data;
      })
    }

    $scope.signin = function() {

     console.log($scope.session);
      $scope.data = {session : $scope.session};
      console.log($scope.data);
      $http({
        method : 'POST',
        url : 'http://localhost:3000/login',
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
        $rootScope.$emit("selectTabMethod", {});
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
        url  : 'http://localhost:3000/like/'+post.id,
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
        url : 'http://localhost:3000/comments',
        headers: {
          'Content-Type': "application/json"
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




  