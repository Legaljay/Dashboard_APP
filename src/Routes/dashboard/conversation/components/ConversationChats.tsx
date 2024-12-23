import { Button } from "@/components/ui/button/button";
import { Form } from "@/components/ui/form";
import { FormField } from "@/components/ui/form/types";
import { useCallback } from "react";
import { z } from "zod";

const formSchema = z.object({
    chat_message: z.string(),
    tags: z.array(z.object({})).optional(),
})

const fields: FormField[] = [
    {
        name: "chat_message",
        type: 'textarea',
        placeholder: 'Enter Message here',
        className: 'min-w-56 max-h-40',
        containerClassName: 'w-full space-y-0',
        rows: 1
    }
]

const ConversationChats: React.FC = () => {
    const handleSubmit = useCallback(async() => {

    },[])
  return (
    <div className="h-[69lvh]">
      <div className="text-2xl font-bold">
        <span className="text-[#101828]">Chats</span>
        <span className="text-[#7F7F81]"> (1)</span>
      </div>
      <div className="h-[59lvh]"/>
      <Form
        fields={fields}
        schema={formSchema}
        onSubmit={handleSubmit}
        marginTop="mt-0"
        fieldGroupClassName="space-y-0 w-full"
        className="flex items-center p-0 border-none shadow-none"
        renderButton={() => {
            return(
                <div className="flex items-center">
                    <Button>Submit</Button>
                </div>
            )
        }}
        hideSubmitButton
      />
    </div>
  );
};

export default ConversationChats;
