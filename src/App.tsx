import React, { useState, useEffect } from 'react';
import axios from 'axios';

import LoadingLogo from './assets/images/loading.svg'
import NotFound from './assets/images/not-found.png'
import Dropdown from './assets/images/dropdown.png'
import Star from './assets/images/star.png'

function App() {
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const [userList, setUserList] = useState([])
  const [isEmpty, setEmpty] = useState(false)
  const [userSelected, setUser] = useState<any>(null)
  
  const [staticKeyword, setStaticKeyword] = useState('')
  
  const [loadingRepo, setLoadingRepo] = useState(false)
  const [repoList, setRepo] = useState([])
  
  useEffect(() => {
    if (!keyword) {
      setEmpty(false)
    }
  }, [keyword])
  
  
  const fetchUsers = async () => {
    if (!keyword) {
      setUserList([])
      return
    }
    setStaticKeyword(keyword)
    setLoading(true)
    
    try {
      const res = await axios.get(`https://api.github.com/search/users?q=${keyword}&per_page=5`)
      console.log(res)
      if (res?.data?.items.length < 1) {
        setEmpty(true)
      } else {
        setEmpty(false)
      }
      setUserList(res?.data?.items)
    } catch (error) {
      console.log(error)
    }
    
    setLoading(false)
  }
  
  const handleKeyDown = (event:any) => {    
    if (event?.key === 'Enter') {
      fetchUsers()
    }
  }
  
  const handleSelectUser = async(user:any) => {
    if (userSelected?.id === user.id) {
      setUser(null)
    } else {
      setUser(user)
      
      setLoadingRepo(true)
      try {
        const res = await axios.get(user.repos_url)
        console.log(res)
        setRepo(res.data)
      } catch (error) {
        console.log(error)
      }
      setLoadingRepo(false)
    }
  }
  
  const renderMain = () => {
    return (
      <div className='flex flex-col items-center justify-center h-[calc(100vh-200px)]'>
        <p className='font-bold text-2xl'>Github Repository Explorer</p>
        <p>Enter username to start exploring</p>
      </div>
    )
  }
  
  const renderLoading = () => {
    return (
      <div className='flex items-center justify-center h-[calc(100vh-200px)]'>
        <img src={LoadingLogo} alt="loading" width={100} height={100} />
      </div>
    )
  }
  const renderEmpty = () => {
    return (
      <div className='flex flex-col items-center justify-center h-[calc(100vh-200px)]'>
        <img src={NotFound} alt="no users" width={100} height={100} />
        <p className='font-bold text-2xl'>No Users Found</p>
        <p>Please try a different username</p>
      </div>
    )
  }
  const renderRepoList = () => {
    return repoList.map((repo:any) => (
      <div key={repo.id} className='bg-[#E0E0E0] p-[10px] relative'>
        <div className="absolute top-[12px] right-[10px] flex items-center gap-1">
          <p className='font-bold text-sm'>{repo?.stargazers_count || '0'}</p>
          <img width={16} height={16} src={Star} alt="star icon" />
        </div>
        <p className='font-bold'>{repo?.name || '-'}</p>
        <p>{repo?.description || '-'}</p>
      </div>
    ))
  }
  
  const renderList = () => {
    return (
      <div className='h-[calc(100vh-224px)] mt-3 overflow-auto'>
        <p>Showing users for "{ staticKeyword }"</p>
        <div className="flex flex-col gap-3 pt-3">
          {
            userList.map((user:any) => {
              return (
                <div key={user.id} className="relative">
                  <button type="button" className={`btn-collapsible font-bold ${loadingRepo && 'pointer-events-none'}`} onClick={() => handleSelectUser(user)}>
                    {user?.login}
                  </button>
                  <img src={Dropdown} alt="dropdown" width={10} height={10} className={`absolute right-[15px] top-[15px] ${userSelected?.id === user.id ? 'rotate-180' : 'rotate-0'}`} />
                  <div className={`${userSelected?.id === user.id ? 'flex' : 'hidden'} ${loadingRepo ? 'pl-0' : 'pl-10'} flex-col gap-3 mt-3`}>
                    { loadingRepo && <div className='flex items-center justify-center h-10 my-5'><img src={LoadingLogo} alt="loading" width={50} height={50} /></div> }
                    { !loadingRepo && repoList.length < 1 && <p>This user doesn't have repository.</p> }
                    { !loadingRepo && repoList.length && renderRepoList() }
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
  
  return (
    <div className="App">
      <div className="bg-[#282c34] md:p-10 p-5 h-screen w-screen flex flex-col items-center justify-center">
        <div className="max-w-2xl bg-[#FEFEFE] md:h-[calc(100vh-80px)] h-[calc(100vh-40px)] md:w-[calc(100vw-80px)] w-[calc(100vw-40px)] rounded-lg p-5">
          <div className="flex flex-col gap-5">
            <input
              className='h-10 w-full bg-[#F2F2F2] rounded-lg py-2 px-[15px]'
              placeholder='Enter username'
              type="text"
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              value={keyword}
            />
            <button className='btn-primary' onClick={fetchUsers}>Search</button>
          </div>
          { loading && renderLoading() }
          { !loading && !keyword && !userList.length && renderMain() }
          { !loading && isEmpty && keyword && renderEmpty() }
          { !loading && userList.length > 0 && renderList() }
        </div>
      </div>
    </div>
  );
}

export default App;
