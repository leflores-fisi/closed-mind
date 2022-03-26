import { emitSocketEvent } from '../../../userSocket';
import useAppReducer from '../../../../hooks/useAppReducer';

function MessageReactionsList({ reactions, message_id }) {

  const {store} = useAppReducer();

  return (
    reactions.length > 0 &&
      <div className='reactions-container'>
        {
          reactions.map(reaction => {
            let reactedBySelf = reaction.who.includes(store.user_id);
            return (
              <button key={reaction.emote} className={`reaction ${reactedBySelf ? 'reacted' : ''}`} onClick={() => {
                let storedReaction = reactions.find(storedReaction => storedReaction.emote === reaction.emote);
                if (storedReaction.who.includes(store.user_id)) {
                  if (storedReaction.who.length > 1) {
                    console.log(`(@From down reactions) DECREASING REACTION FROM ${message_id} WAS`, reaction.emote); 
                    emitSocketEvent['decreasing-reaction']({message_id: message_id, emote: reaction.emote});
                  }
                  else {
                    console.log(`(@From down reactions) DELETING REACTION FROM ${message_id} WAS`, reaction.emote); 
                    emitSocketEvent['deleting-reaction-from-message']({message_id: message_id, emote: reaction.emote});
                  }
                }
                else {
                  console.log(`(@From down reactions) REACTION TO ${message_id} WITH`, reaction.emote); 
                  emitSocketEvent['reacting-to-message']({message_id: message_id, emote: reaction.emote});
                }
              }}>
                <span className='emote'>{reaction.emote}</span>
                <span className='emote-count'>{reaction.who.length}</span>
              </button>
            )
          })
        }
      </div>
  );
}
export default MessageReactionsList;

/*
[
  {
    "code": 1,
    "messages": [
      {
        message_id: 2,
        reactions: [
          {
            emote: "😡"
          }
        ]
      }
    ]
  }
]
db.collection.update({
  code: 1,
  messages: {
    $elemMatch: {
      message_id: 2
    }
  }
},
{
  $pull: {
    "messages.$.reactions": {
      "emote": "😡"
    }
  }
})
*/