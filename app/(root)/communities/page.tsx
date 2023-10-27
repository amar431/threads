import PostThread from "@/components/forms/PostThread"
import ProfileHeader from "@/components/shared/ProfileHeader"
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"

import { redirect } from "next/navigation"

import Image from "next/image"
import ThreadsTab from "@/components/shared/ThreadsTab"
import UserCard from "@/components/cards/UserCard"
import { fetchCommunities } from "@/lib/actions/community.actions"
import CommunityCard from "@/components/cards/CommunityCard"
import SearchBar from "@/components/shared/SearchBar"
import Pagination from "@/components/shared/pagination"





const Page = async({
    searchParams,
  }: {
    searchParams: { [key: string]: string | undefined };
  }) =>{
    const user = await currentUser()
    if (!user)  return null

    const userInfo = await fetchUser(user.id)

    if (!userInfo?.onboarded) redirect ('/onboarding')

    const result = await fetchCommunities(
        {
            searchString: searchParams.q,
            pageNumber: searchParams?.page ? +searchParams.page : 1,
            pageSize: 25,
        })


  return (
    <>
        <h1 className="head-text mb-10">Search</h1>
        <div className='mt-5'>
        <SearchBar routeType='communities' />
      </div>


        <section className='mt-14 flex flex-col gap-9'>
            {result.communities.length === 0? (
                <p className="no-result">No User Found</p>
            ):(
                <>
                {result.communities.map((community)=>(
                    <CommunityCard
                    key={community.id}
                    id = {community.id}
                    name = {community.name}
                    username = {community.username}
                    imgUrl = {community.image}
                    bio = {community.bio}
                    members={community.members}
                    
                    />
                ))}
                </>
            )}

        </section>
        <Pagination
        path='communities'
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      />
    </>
    
  )
}

export default Page