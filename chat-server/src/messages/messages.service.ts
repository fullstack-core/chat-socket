import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessageEntity } from './entities/message.entity';

@Injectable()
export class MessagesService {
  rooms = [
    {
      id: 1,
      clientToUser: {},
      messages: [
        {
          name: 'John Doe',
          text: 'Hello World',
        },
      ],
    },
    {
      id: 2,
      clientToUser: {},
      messages: [
        {
          name: 'Max Mustermann',
          text: 'Nice to meet you',
        },
      ],
    },
  ];

  join(name: string, room: string, clientId: string) {
    this.rooms.find((element) => element.id === +room).clientToUser[clientId] =
      name;
    return Object.values(
      this.rooms.find((element) => element.id === +room).clientToUser,
    );
  }

  findAll(room: string) {
    return this.rooms.find((element) => element.id === +room).messages;
  }

  getClientName(room: string, clientId: string) {
    return this.rooms.find((element) => element.id === +room).clientToUser[
      clientId
    ];
  }

  create(room: string, createMessageDto: CreateMessageDto, clientId: string) {
    const message = {
      name: this.getClientName(room, clientId),
      text: createMessageDto.text,
    };
    this.rooms.find((element) => element.id === +room).messages.push(message);
    return message;
  }

  //--------------------------------------------------

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
