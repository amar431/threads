"use client"
import {
    Form
} from '@/components/ui/form'
import { useForm } from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod'
import { CommentValidation } from '@/lib/validations/thread';

import { Button } from "@/components/ui/button"
import {
    
    FormControl,
    FormDescription,
    FormField,
    FormItem, 
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
  import { Input } from "@/components/ui/input"
  import * as z from 'zod'
import { useState } from 'react';
// import { updateUser } from '@/lib/actions/user.actions';
import { usePathname,useRouter } from 'next/navigation';
import Image from 'next/image';
import { addCommentToThread } from '@/lib/actions/thread.actions';
// import { createThread } from '@/lib/actions/thread.actions';
interface Props{
    threadId:string,
    currentUserImg:string,
    currentUserId:string

}
const Comment = ({threadId,currentUserImg,currentUserId}:Props) =>{
    
    const pathname = usePathname()
  
      
    const form = useForm<z.infer<typeof CommentValidation>>({
      resolver: zodResolver(CommentValidation),
      defaultValues: {
        thread: "",
      },
    });
  
          const onSubmit = async(values:z.infer<typeof CommentValidation>) =>{
              await addCommentToThread(threadId,
                values.thread,
                JSON.parse(currentUserId),
                pathname)
              form.reset()
                    
  
          }




    return(
        <Form {...form}>
    <form 
    onSubmit={form.handleSubmit(onSubmit)}
     className="comment-form ">
       

    <FormField
    control={form.control}
    name="thread"
    render={({ field }) => (
    <FormItem className='flex items-center w-full  gap-3'>
        <FormLabel >
        <Image 
        src={currentUserImg}
        alt="profile Image"
        width={48}
        height={48}
        className='rounded-full object-cover'
        />
        </FormLabel>
        <FormControl className='border-none bg-transparent  '>
        <Input 
        type = "text"
        {...field}
        placeholder='Comment...'
        className='no-focus text-light-1 outline-none'
        
        />

        
        
        </FormControl>
        <FormMessage  />
    </FormItem>
    )}
    />
    <Button type='submit' className='comment-form_btn'>Reply</Button>
    
    </form>
    </Form>
   ) 
    }
export default Comment