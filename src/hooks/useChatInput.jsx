import { chatInputContext } from "@/context/chatInputContext";
import { useContext } from "react";

function useChatInput() {
  return (useContext(chatInputContext));
}
export default useChatInput;