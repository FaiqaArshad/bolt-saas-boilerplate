import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Users, Pencil, Trash2, Check, X, Plus, Building2 } from 'lucide-react';
import type { Team, Organization } from '../lib/types';
import { CreateTeamModal } from '../components/CreateTeamModal';

interface TeamWithOrg extends Team {
  organization: Organization;
}

export function Teams() {
  const [teams, setTeams] = useState<TeamWithOrg[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    slug: '',
    organization_id: ''
  });

  useEffect(() => {
    loadTeams();
    loadOrganizations();
  }, []);

  async function loadTeams() {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select(`
          *,
          organization:organizations (*)
        `)
        .order('name', { ascending: true });

      if (error) throw error;
      setTeams(data || []);
    } catch (error) {
      console.error('Error loading teams:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadOrganizations() {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setOrganizations(data || []);
    } catch (error) {
      console.error('Error loading organizations:', error);
    }
  }

  const startEditing = (team: TeamWithOrg) => {
    setEditingId(team.id);
    setEditForm({
      name: team.name,
      slug: team.slug,
      organization_id: team.organization_id
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({ name: '', slug: '', organization_id: '' });
  };

  const handleUpdate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('teams')
        .update({
          name: editForm.name,
          slug: editForm.slug,
          organization_id: editForm.organization_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      await loadTeams();
      cancelEditing();
    } catch (error) {
      console.error('Error updating team:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this team?')) return;
    
    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadTeams();
    } catch (error) {
      console.error('Error deleting team:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 shadow p-6">
        <div className="sm:flex sm:items-center sm:justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Teams
          </h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Team
          </button>
        </div>

        <div className="mt-4 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Name
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Organization
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Slug
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Created At
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {teams.map((team) => (
                    <tr key={team.id}>
                      {editingId === team.id ? (
                        <>
                          <td className="whitespace-nowrap px-3 py-4">
                            <input
                              type="text"
                              value={editForm.name}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                            />
                          </td>
                          <td className="whitespace-nowrap px-3 py-4">
                            <select
                              value={editForm.organization_id}
                              onChange={(e) => setEditForm({ ...editForm, organization_id: e.target.value })}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                            >
                              {organizations.map((org) => (
                                <option key={org.id} value={org.id}>
                                  {org.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4">
                            <input
                              type="text"
                              value={editForm.slug}
                              onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                            />
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {new Date(team.created_at).toLocaleDateString()}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button
                              onClick={() => handleUpdate(team.id)}
                              className="text-green-600 hover:text-green-900 dark:hover:text-green-400 mr-2"
                            >
                              <Check className="h-5 w-5" />
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 dark:text-white">
                            <div className="flex items-center">
                              <Users className="h-5 w-5 mr-2 text-gray-400" />
                              {team.name}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                              {team.organization.logo_url ? (
                                <img
                                  src={team.organization.logo_url}
                                  alt={team.organization.name}
                                  className="h-5 w-5 rounded-full mr-2"
                                />
                              ) : (
                                <Building2 className="h-5 w-5 mr-2 text-gray-400" />
                              )}
                              {team.organization.name}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {team.slug}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {new Date(team.created_at).toLocaleDateString()}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button
                              onClick={() => startEditing(team)}
                              className="text-indigo-600 hover:text-indigo-900 dark:hover:text-indigo-400 mr-2"
                            >
                              <Pencil className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(team.id)}
                              className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <CreateTeamModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadTeams}
      />
    </>
  );
}