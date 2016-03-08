/**
 * Created by milos_000 on 25-Feb-16.
 */

angular.module('mrau', ['ngCordova', 'ngMaterial'])
    .controller('GameController', ['$scope', '$cordovaDialogs', function($scope, $cordovaDialogs){
        $scope.games = [];
        $scope.players = [
            {
                id: 0,
                name: 'Pera',
                totalScore: 123,
                previewScore: 0,
                unlockInput: true,
                newScore: 0,
            },
            {
                id: 1,
                name: 'Zika',
                totalScore: 321,
                previewScore: 0,
                unlockInput: true,
                newScore: 0,
            },
            {
                id: 2,
                name: 'Laza',
                totalScore: 111,
                previewScore: 0,
                unlockInput: true,
                newScore: 0,
            }
        ];
        $scope.uniqueId = 0;
        $scope.totalGames = 0;
        $scope.totalPlayers = 3;
        $scope.dealerIndex = 0;
        $scope.shouldAnnulScore = true;
        $scope.newPlayerAverageScore = false;
        $scope.scores = [];
        $scope.scoresAdded = 0;
        var _this = $scope;

        $scope.getNumbers = function(){
            var numbers = [];
            for (i = 0; i < 25; i++) {
                numbers.push(i);
            }

            numbers.unshift(-10);
            numbers.unshift(-20);

            return numbers;
        };


        /**
         * Reset table dialog
         */
        $scope.confirmResetTable = function() {
            $cordovaDialogs.confirm('Rezultati će biti obrisani za sve igrače.', 'Obriši rezultate?', ['Da','Ne, ne'])
                .then(function(buttonIndex) {
                    // no button = 0, 'OK' = 1, 'Cancel' = 2
                    if (buttonIndex == 1) {
                        _this.resetScore();
                    }
                });
        };

        /**
         * Delete player dialog
         * @param id
         */
        $scope.confirmDeletePlayer = function(id, playerName) {
            $cordovaDialogs.confirm(playerName + " napušta igru?", "Obriši igrača", ['Da', 'Ne, ne'])
                .then(function(buttonIndex) {
                    // no button = 0, 'OK' = 1, 'Cancel' = 2
                    if (buttonIndex == 1) {
                        _this.removePlayer(id);
                    }
                });
        };

        /**
         * Reset the score
         */
        $scope.resetScore = function(){
            this.games = [];
            this.totalGames = 0;
            var _this = $scope;
            angular.forEach(this.players, function(value, key) {
                if (_this.players[value.id]) {
                    _this.players[value.id].totalScore = 0;
                }
            });
        };

        $scope.getPlayersScores = function(game){
            var playersScores = [];
            angular.forEach($scope.players, function(player, key){
                // If less results than players
                // e.g. a new player added after few rounds
                if (typeof game[key] === 'undefined') game[key] = 0;
                playersScores.push(game[key]);
            });
            return playersScores;
        };

        $scope.inputActive = [];
        /**
         * Update the result preview
         * @param index Result order
         */
        $scope.changeResultPreview = function(player){
            if ($scope.annulScore(player.totalScore + player.newScore) && $scope.shouldAnnulScore) {
                player.previewScore = '0';
            } else {
                player.previewScore = player.totalScore + player.newScore;
            }
        };

        $scope.addScore = function(player){
            if (player.newScore === '' || angular.isUndefined(player.newScore)) {
                player.newScore = 0;
            }
            console.log(player.newScore);
            player.totalScore = player.totalScore + player.newScore;
            player.previewScore = 0;
            player.unlockInput = false;
            $scope.scoresAdded++;
            // If scores added for all the players
            if ($scope.scoresAdded == $scope.totalPlayers) {
                angular.forEach($scope.players, function(player, key){
                    player.unlockInput = true;
                    player.newScore = 0;
                });
                $scope.scoresAdded = 0;
                // Reset scroller position
                $(".scroller-body").each(function () {
                    $(this).scrollTop(80);
                });
            }
        };

        /**
         * Save the round results
         */
        /*
        $scope.saveRound = function(){
            // Check results for all the players
            var _this = $scope;
            angular.forEach($scope.players, function(player, key) {
                // Set default score value
                if (typeof _this.scores[key] === 'undefined') {
                    _this.scores[key] = 0;
                }
                var playerScore = _this.scores[key];
                // Normalize score value
                if (playerScore == "") playerScore = 0;
                playerScore = parseInt(playerScore);
                // Increment player total score
                player.totalScore = player.totalScore + playerScore;
                if (_this.shouldAnnulScore && _this.annulScore(player.totalScore)) {
                    player.totalScore = 0;
                }
                player.previewScore = 0;
                _this.inputActive[key] = false;
            });

            // Add new game to games array
            $scope.games.push($scope.scores);
            // Clear game scores
            $scope.scores = [];
            // Increment number of games
            $scope.totalGames++;
            // Set next dealer index
            $scope.dealerIndex++;
            if (typeof $scope.players[$scope.dealerIndex] === 'undefined') {
                // No next player, move to the first one: players[0]
                $scope.dealerIndex = 0;
            }
        };

        */

        /**
         * Check if all digits are the same
         * @param score Number
         * @returns {boolean}
         */
        $scope.annulScore = function(score) {
            var number = ('' + score);
            if (number.length == 1) return false;
            var firstDigit = number.charAt(0);
            for (i = 0; i < number.length; i++) {
                if (firstDigit != number[i]) return false;
            }
            return true;
        };

        $scope.clearNewScore = function(player) {
            console.log("Input clicked!");
            player.newScore = '';
        };

        /**
         * Add new player
         */
        $scope.addPlayer = function(){
            $scope.player.id = $scope.uniqueId++;
            $scope.player.name = $scope.player.name.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                return letter.toUpperCase();
            });
            $scope.player.totalScore = 0;
            $scope.player.newScore = 0;
            if ($scope.newPlayerAverageScore) {
                $scope.player.totalScore = $scope.getAverageScore();
            }
            $scope.player.previewScore = 0;
            $scope.players.push($scope.player);
            $scope.player = {};
            $scope.totalPlayers++;
            // Retroactively set results
            angular.forEach($scope.games, function(round, keyG) {
                _this.games[keyG].push(0);
            });
        };

        $scope.getAverageScore = function() {
            var scoresSum = 0;
            angular.forEach($scope.players, function(player, key){
                scoresSum += player.totalScore;
            });
            return scoresSum / $scope.totalPlayers;
        };

        /**
         * Delete a player
         * @param id
         */
        $scope.removePlayer = function(id){
            var _this = $scope;
            // Current dealer id
            var dealerId = $scope.players[$scope.dealerIndex].id;
            // Remove player
            var playerKey = 0;
            angular.forEach($scope.players, function(player, key) {
                if (player.id == id) {
                    _this.players.splice(key, 1);
                    playerKey = key;
                }
            });
            // Remove player scores
            angular.forEach($scope.games, function(round, keyG) {
                _this.games[keyG].splice(playerKey, 1);
            });
            // Set next dealer index
            if (dealerId > id ) {
                // If the dealer comes after the removed player,
                // change the dealer index
                $scope.dealerIndex--;
            }
            if (typeof $scope.players[$scope.dealerIndex] === 'undefined') {
                // No next player, move to the first one: players[0]
                $scope.dealerIndex = 0;
            }
            $scope.totalPlayers--;
            if ($scope.totalPlayers == 0) $scope.resetScore();
        };
    }]);