"use client"
import {
    Form
} from '@/components/ui/form'
import { useForm } from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod'
import { ThreadValidation } from '@/lib/validations/thread';
import { useOrganization } from '@clerk/nextjs';

import { Button } from "@/components/ui/button"
import {
    
    FormControl,
    FormDescription,
    FormField,
    FormItem, 
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
  import { Textarea } from "@/components/ui/textarea"
  import * as z from 'zod'
import { useState } from 'react';
// import { updateUser } from '@/lib/actions/user.actions';
import { usePathname,useRouter } from 'next/navigation';
import { createThread } from '@/lib/actions/thread.actions';



interface Props {
    user: {
      id: string;
      objectId: string;
      username: string;
      name: string;
      bio: string;
      image: string;
    };
    btnTitle: string;
  }


  

function PostThread({userId}:{userId:string}){
  const router = useRouter()
  const pathname = usePathname()
  const {organization} = useOrganization()

    
  const form = useForm<z.infer<typeof ThreadValidation>>({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: "",
      accountId: userId,
    },
  });

        const onSubmit = async(values:z.infer<typeof ThreadValidation>) =>{
          console.log('organization',organization)
          
            await createThread({
              text:values.thread,
              author:userId,
              communityId:organization ? organization.id : null,
              path: pathname
            })
          
          
          
            router.push("/")       

        }


        
    return (
        
    <Form {...form}>
    <form 
    onSubmit={form.handleSubmit(onSubmit)}
     className="flex flex-col justify-start gap-10 ">
       

    <FormField
    control={form.control}
    name="thread"
    render={({ field }) => (
    <FormItem className='mt-10 flex flex-col w-full  gap-3'>
        <FormLabel className='text-base-semibold text-gray-200'>
        Content
        </FormLabel>
        <FormControl className='border border-dark-4 hover:bg-blue-500 bg-dark-3 text-light-1  '>
        <Textarea 
        rows={15}
        {...field}
        />

        
        
        </FormControl>
        <FormMessage  />
    </FormItem>
    )}
    />
    <Button type='submit' className='bg-primary-500'>Post Thread</Button>
    
    </form>
    </Form>
   ) 
    }
        
    
export default PostThread