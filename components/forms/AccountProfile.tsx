"use client"
import {
    Form
} from '@/components/ui/form'
import { useForm } from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod'
import { userValidation } from '@/lib/validations/user';

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
  import { Textarea } from "@/components/ui/textarea"
  import * as z from 'zod'
import Image from 'next/image';
import { ChangeEvent } from 'react';
import { useState } from 'react';
import { isBase64Image } from '@/lib/utils'
import { useUploadThing } from '@/lib/uploadthing';
import { updateUser } from '@/lib/actions/user.actions';
import { usePathname,useRouter } from 'next/navigation';



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

const AccountProfile = ({user,btnTitle}:Props) => {
  const[files,setFiles] = useState<File[]>([])
  const {startUpload} = useUploadThing("media")
  const router = useRouter()
  const pathname = usePathname()

    
    const form = useForm({
        resolver: zodResolver(userValidation),
        defaultValues: {
            profile_photo:  user?.image || "",
            name: user?.name || "",
            username: user?.username || "",
            bio:  user?.bio || "",
          },
        })
        const onSubmit =  async (values: z.infer<typeof userValidation>)=> {
          const blob = values.profile_photo

          const hasImageChanged = isBase64Image(blob)

          if(hasImageChanged) {
            const imgRes = await startUpload(files)

            if(imgRes && imgRes[0].url){
              values.profile_photo = imgRes[0].url
            }
          }

        

          await updateUser(
            {
              name: values.name,
              path: pathname,
              username: values.username,
              userId: user.id,
              bio: values.bio,
              image: values.profile_photo,
            })

            if(pathname === '/profile/edit'){
              router.back()
            }else{
              router.push('/')
            }



          
          
        }
      const handleImage = (event: ChangeEvent<HTMLInputElement>,fieldChange:(value:String)=>void) =>{
        event?.preventDefault()

        const fileReader = new FileReader()

        if ( event.target.files && event.target.files.length > 0){
          const file = event.target.files[0]
          setFiles(Array.from(event.target.files))

          if(!file.type.includes('image')) return
          // console.log(event.target.files)
          console.log(file)

          fileReader.onload = async (event) => {
            const imageDataUrl =  event.target?.result?.toString() || ''
            fieldChange(imageDataUrl)
            
            
            
          }
          
          fileReader.readAsDataURL(file)
        }
      }
      
  return (
    <Form {...form}>
    <form 
    onSubmit={form.handleSubmit(onSubmit)}
     className="flex flex-col justify-start gap-10 ">
      <FormField
        control={form.control}
        name="profile_photo"
        render={({ field }) => (
          <FormItem className='flex items-center gap-4 '>
            <FormLabel className='account-form_image'>
            {field.value ? (
                  <Image
                    src={field.value}
                    alt='profile_icon'
                    width={96}
                    height={96}
                    priority
                    className='rounded-full object-contain'
                  />
                ) : (
                  <Image
                    src='/assets/profile.svg'
                    alt='profile_icon'
                    width={24}
                    height={24}
                    className='object-contain'
                  />
                )}
             
            </FormLabel>
            <FormControl className='flex-1 text-base-semibold text-gray-200'>
              <Input 
              type="file"
              accept='image/*'
              placeholder='Upload a Photo'
              className='account-form_image-input'
              onChange={(event)=> handleImage(event,field.onChange)}
              
              />
                  </FormControl>
                  <FormMessage  />
            </FormItem>
          )}
        />

      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem className='flex  flex-col w-full  gap-3'>
            <FormLabel className='text-base-semibold text-gray-200'>
              Name
            </FormLabel>
            <FormControl >
              <Input 
              type="text"
              className='account-form_input no-focus'
              {...field}
              />
             
            </FormControl>
            <FormMessage  />
          </FormItem>
        )}
      />

      
<FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem className='flex  flex-col w-full  gap-3'>
          <FormLabel className='text-base-semibold text-gray-200'>
            Username
          </FormLabel>
          <FormControl >
            <Input
              className='account-form_input no-focus'
              {...field}
              />
             
            </FormControl>
            <FormMessage  />
          </FormItem>
        )}
      />

      
<FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem className='flex  flex-col w-full  gap-3'>
            <FormLabel className='text-base-semibold text-gray-200'>
              Bio
            </FormLabel>
            <FormControl >
              <Textarea
              rows={10}
              className='account-form_input no-focus'
              {...field}
              />
             
            </FormControl>
            <FormMessage  />
          </FormItem>
        )}
      />
        <Button type="submit" className='bg-primary-500'>Submit</Button>
      </form>
    </Form>


  )
}

export default AccountProfile