// ====================================================================================================
//
// Cloud Code for RT_tutorials, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================

const MIN_PLAYER = 3;
const MAX_PLAYER = 4;

var timeServerSync = 1000;

var playersJoined = [4]; // only use at the start to make sure each player is connected
var totalPlayers = 0;

RTSession.onPlayerConnect(function(player)
{
    // if (totalPlayers === 0)
    // {
    //     RTSession.newRequest().createMatchDetailsRequest()
    //         .setMatchId(RTSession.getSessionId())
    //         .setPlayerId(player.getPlayerId())
    //         .setRealtimeEnabled(true)
    //         .send(function(response){
    //             totalPlayers = response.opponents.length + 1; // we add one to this because the opponents list doesn't include us
    //         })
    // }
    
    //  first we check to see if the player has already joined the match
    // if (!contains(playersJoined, player.getPeerId()))
    // {
    //     playersJoined.push(player.getPeerId());       
    // }

    // next we check to see the max (or min) number of players has joined that match
    //if ((playersJoined.length === MIN_PLAYER) || (playersJoined.length === MAX_PLAYER))
    // if (playersJoined.length === 2)
    // {
    //     RTSession.newPacket().setOpCode(100).setTargetPeers().send(); // send an empty pack back to all players
        
    //     RTSession.setInterval(function(){
    //         RTSession.getLogger().debug(new Date().getTime());
    //         RTSession.newPacket()
    //             .setOpCode(102)
    //             .setTargetPeers() // send to all players
    //             .setData(RTSession.newData()
    //                 .setNumber(1, new Date().getTime())).send();
    //     }, timeServerSync)
    // }
    
    // first we check to see if the player has already joined the match
    if(!contains(player.getPeerId(), playersJoined)){
        playersJoined.push(player.getPeerId()); // and add them if not
    }
    RTSession.getLogger().debug(playersJoined.length);
    // next we check to see the max (or min) number of players has joined that match
    if(playersJoined.length === 2){
        RTSession.newPacket().setOpCode(100).setTargetPeers().send(); // send an empty pack back to all players

        RTSession.setInterval(function(){ // send current server time to all players every 1second
            RTSession.getLogger().debug(new Date().getTime());
            RTSession.newPacket().setOpCode(102).setTargetPeers().setData( RTSession.newData().setNumber(1, new Date().getTime() )).send();
        }, 1000);
    }
});

//function IsPlayerAlreadyConnected(listPlayers, player)   // this is a simple method that just checks if an element is in an array or not
//{
//    for (var index = 0; index < listPlayers.length; index++)
//    {
//        if (listPlayers[index] === player)
//        {
//            return true;
//        }
//    }
    
//    return false;
//};

function contains(a, obj) { // this is a simple method that just checks if an element is in an array or not
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
};

// packet 101 is a timestamp from the client for clock-syncing
RTSession.onPacket(101, function(packet){
    var rtData = RTSession.newData().setNumber(1, packet.getData().getNumber(1)) // return the timestamp the server just got
                                    .setNumber(2, new Date().getTime()) // return the current time on the server
    // players.push(packet.getSender().getPeerId());
    RTSession.newPacket().setData(rtData).setOpCode(101).setTargetPeers(packet.getSender().getPeerId()).send(); // send the packet back to the peer that sent it
    // we've also set this packet to be op-code 101.
    // we used 101 to send the packet, but we only ever send the packet from client-to-server
    // which means we can re-use the op-code to receive packets with the same op-code
});
