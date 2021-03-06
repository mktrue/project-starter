import { gql } from 'apollo-server-express';
import userQueries from './entities/User/User.queries';
import userMutations from './entities/User/User.mutations';
import { User } from './entities/User/User.schema';
import taskQueries from './entities/Task/Task.queries';
import taskMutations from './entities/Task/Task.mutations';
import { Task, UpdateTaskInput } from './entities/Task/Task.schema';

const RootQuery = gql`
  type RootQuery {
    me: User 

    task (id: Int!): Task @isAuthenticated
    tasks: [Task]
  }
`;

const RootMutation = gql`
  type RootMutation {
    signup (username: String!, email: String!, password: String!): String
    login (email: String!, password: String!): String

    createTask (task: UpdateTaskInput!): Task
    completeTask (id: Int!): String
  }
`;

const SchemaDefinition = gql`
  directive @isAuthenticated on QUERY | FIELD | MUTATION | FIELD_DEFINITION
  schema {
    query: RootQuery
    mutation: RootMutation
  }
`;

export default {
  typeDefs: [
    SchemaDefinition, RootQuery, RootMutation,
    User,
    Task, UpdateTaskInput,
  ],
  resolvers: {
    RootQuery: {
      ...userQueries,
      ...taskQueries,
    },
    RootMutation: {
      ...userMutations,
      ...taskMutations,
    },
  },
  directiveResolvers: {
    isAuthenticated: (next, source, args, context) => {
      if (context.user) return next();
      throw new Error('Must be authenticated');
    },
  },
};
