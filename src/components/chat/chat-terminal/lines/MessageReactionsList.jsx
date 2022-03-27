import { useRef } from 'react';
import { emitSocketEvent } from '../../../userSocket';
import useAppReducer from '../../../../hooks/useAppReducer';

function MessageReactionsList({ reactions, message_id }) {

  const {store} = useAppReducer();
  const buttonRef = useRef(null);

  return (
    reactions.length > 0 &&
      <div className='reactions-container'>
        {
          reactions.map(reaction => {
            let reactedBySelf = reaction.users_list.includes(store.user_id);
            return (
              <button ref={buttonRef} key={reaction.emote} className={`reaction ${reactedBySelf ? 'reacted' : ''}`} onClick={() => {
                let storedReaction = reactions.find(storedReaction => storedReaction.emote === reaction.emote);

                if (storedReaction.users_list.includes(store.user_id)) {
                  if (storedReaction.users_list.length > 1) {
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
                  buttonRef.current.disabled = true;
                  setTimeout(() => {
                    buttonRef.current.disabled = false;
                  }, 500)
                }
              }}>
                <span className='emote'>{reaction.emote}</span>
                <span className='emote-count'>{reaction.users_list.length}</span>
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