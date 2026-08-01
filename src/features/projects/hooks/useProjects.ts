import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../../store/store';
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
  clearError,
} from '../store/projectsSlice';
import type { CreateProjectRequest, UpdateProjectRequest } from '../types/project.types';

export const useProjects = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { projects, total, isLoading, error } = useSelector(
    (state: RootState) => state.projects
  );

  useEffect(() => {
    dispatch(fetchProjects(undefined));
  }, [dispatch]);

  const handleCreate = useCallback(
    async (data: CreateProjectRequest) => {
      const result = await dispatch(createProject(data));
      return result.meta.requestStatus === 'fulfilled';
    },
    [dispatch]
  );

  const handleUpdate = useCallback(
    async (id: string, data: UpdateProjectRequest) => {
      const result = await dispatch(updateProject({ id, data }));
      return result.meta.requestStatus === 'fulfilled';
    },
    [dispatch]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      const result = await dispatch(deleteProject(id));
      return result.meta.requestStatus === 'fulfilled';
    },
    [dispatch]
  );

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const refetch = useCallback(() => {
    dispatch(fetchProjects(undefined));
  }, [dispatch]);

  return {
    projects,
    total,
    isLoading,
    error,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleClearError,
    refetch,
  };
};
