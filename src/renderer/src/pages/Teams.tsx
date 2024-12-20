import { useState } from 'react'
import { DUMMY_USERS } from '../utils/dummyUsers.js'
import UserStat from '@renderer/components/UserStat.js'
import ChatTable from '@renderer/components/ChatTable.js'
import TeamFilterHeader from '@renderer/components/TeamFilterHeader.js'
import AgentEditProfileModal from '@renderer/components/modal/AgentEditProfileModal.js'
import { Images } from '@renderer/constant/Image.js'
import ActivityHistory from '@renderer/components/ActivityHistory.js'
import TeamTable from '@renderer/components/TeamsTable.js'
import { getTeam } from '@renderer/api/queries/adminqueries.js'
import { token } from '@renderer/api/config.js'
import { useQuery } from '@tanstack/react-query'

interface Agent {
  fullName: string
  username: string
  role: string
  departments: string[]
  password: string
  profilePhoto?: string
}

const Teams = () => {
  const sampleData = [
    {
      id: 1,
      name: 'Qamardeen Abdulmalik',
      username: 'Alucard',
      status: 'Active', // Status will determine green or red dot
      role: 'Manager', // Either 'Manager' or 'Agent'
      dateAdded: 'Nov 7, 2024',
      department: ['Sell crypto', 'Buy crypto'],
      password: '12345',
      avatar: Images.agent1
    },
    {
      id: 2,
      name: 'Adam Sandler',
      username: 'Adam',
      status: 'Active',
      role: 'Agent',
      dateAdded: 'Nov 7, 2024',
      department: ['Sell crypto', 'Buy crypto'],
      password: '12345',
      avatar: Images.agent1
    },
    {
      id: 3,
      name: 'Sasha Sloan',
      username: 'Sasha',
      status: 'Inactive',
      role: 'Agent',
      dateAdded: 'Nov 7, 2024',
      department: ['Sell crypto', 'Buy crypto'],
      password: '12345',
      avatar: Images.agent1
    }
  ]

  const [activeTab, setActiveTab] = useState<'online' | 'offline'>('online')
  const [selectedRole, setSelectedRole] = useState<'Manager' | 'Agent' | 'Roles'>('Roles')
  const [searchValue, setSearchValue] = useState('')
  const [isEditClick, setIsEditClick] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<Agent>()
  const [isUserViewed, setIsUserViewed] = useState(false)
  const [selectAgentActivityId, setSelectAgentActivityId] = useState(1);

  console.log(selectAgentActivityId);
  const handleTabChange = (tab: 'Active' | 'Deleted') => {
    setActiveTab(tab)
  }
  const { data: teamData, isLoading, isError, error } = useQuery({
    queryKey: ['teamData'],
    queryFn: () => getTeam({ token }),
    enabled: !!token,
  });

  const handleRoleChange = (role: 'Manager' | 'Agent' | 'Roles') => {
    setSelectedRole(role)
  }

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
  }

  const handleEditClick = (agentId: number) => {
    const agent = sampleData.find((item) => item.id === agentId)
    if (agent) {
      setSelectedAgent({
        fullName: agent.name,
        username: agent.username,
        role: agent.role,
        departments: agent.department || [],
        password: agent.password,
        profilePhoto: agent.avatar || ''
      })
      setIsEditClick(true)
    }
  }

  const changeView = ( selectedUserUd: number ) => {
    setIsUserViewed(true)
    setSelectAgentActivityId(selectedUserUd)
  }

  const filteredData = teamData?.data.filter((member) => {
    const matchesTab =
      activeTab === 'Active' ? member.AgentStatus === 'online' : member.AgentStatus === 'offline'
    const matchesRole = selectedRole === 'Roles' || member.user.role === selectedRole
    const matchesSearch =
      searchValue === '' ||
      member.user.firstname?.toLowerCase().includes(searchValue.toLowerCase()) ||
      member.user.username.toLowerCase().includes(searchValue.toLowerCase())

    return matchesTab && matchesRole && matchesSearch
  })
  console.log(isUserViewed)
  return (
    <div className="p-6 space-y-8 w-full">
      <div className="flex items-center justify-between">
        {/* Header */}
        <h1 className="text-[40px] text-gray-800">Teams</h1>

        <button className="bg-green-800 text-white py-2 px-3 rounded-lg">Add team member</button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
        <UserStat
          title="Total Team Members"
          value={DUMMY_USERS.length}
          change="15%"
          showStats={true}
        />
        <UserStat title="Online" value="15" />
        <UserStat title="Offline" value="5" />
      </div>

      {/* Filters */}

      {isUserViewed ? (
        <ActivityHistory />
      ) : (
        <div>
          <TeamFilterHeader
            activeTab={activeTab}
            selectedRole={selectedRole}
            searchValue={searchValue}
            onTabChange={handleTabChange}
            onRoleChange={handleRoleChange}
            onSearchChange={handleSearchChange}
          />
          <TeamTable
            data={filteredData}
            isTeam={true}
            isTeamCommunition={false}
            onUserViewed={changeView}
            onEditHanlder={(agentId) => handleEditClick(agentId)}
          />
        </div>
      )}
      {/* Edit Modal */}
      {isEditClick && selectedAgent && (
        <AgentEditProfileModal
          isOpen={isEditClick}
          onClose={() => setIsEditClick(false)}
          agentData={selectedAgent}
          onUpdate={(updatedData) => {
            console.log('Updated Data:', updatedData)
            setIsEditClick(false)
          }}
        />
      )}
    </div>
  )
}

export default Teams
